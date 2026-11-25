# Job-Service deployment (pm2)

Job-Service runs under pm2 from the repo checkout (e.g. `/opt/workr/Job-Service`) on its own server, behind nginx.
It calls User-Service over HTTPS (`USER_SERVICE_URL`).

## Every deploy

```bash
ssh ubuntu@<server>
cd /opt/workr/Job-Service
./deploy/deploy.sh
```

What it does, in order - and stops safely at the first problem:

1. Checks `.env` (required keys, `USER_SERVICE_URL` format) - **fails before touching anything**.
2. `git pull --ff-only origin main`.
3. `npm ci` only when `package-lock.json` changed.
4. Builds (`tsc`). A build error leaves the running app untouched.
5. Runs Sequelize migrations. A migration error leaves the running app untouched.
6. `pm2 restart <name> --update-env` - the pm2 process is found by script path, so your existing process is reused, never duplicated.
7. Waits for `http://127.0.0.1:$PORT/health`. If it never answers, it **rolls back automatically** to the previous build (`dist.prev`).
8. `pm2 save`.

Other commands: `./deploy/deploy.sh status | logs | rollback`, options `--no-pull`, `--skip-migrate`, `--force-install`,
`DEPLOY_BRANCH=develop ./deploy/deploy.sh`. Rollback restores the previous *build*; migrations are not reverted, so keep them backward-compatible.
The very first run after adopting this script runs `npm ci` once (it has no saved lock hash yet).

## `.env` - the values that bite

| Key | Must be |
|---|---|
| `USER_SERVICE_URL` | `https://user.workr.club/api/v1/` - **trailing slash required** (the code builds `${USER_SERVICE_URL}users/<id>`), and a URL this server can reach (not localhost) |
| `JWT_SECRET` | the same value as User-Service's - Job-Service verifies the tokens User-Service issues |
| `DB_*` | the RDS host and the Job-Service DB user |

Logs are files in `logs/` (`./deploy/deploy.sh logs`).

## First time on a NEW server

```bash
# Node 22, pm2, nginx, certbot, git
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx git
sudo npm i -g pm2

sudo mkdir -p /opt/workr && sudo chown $USER /opt/workr && cd /opt/workr
git clone <Job-Service repo url> Job-Service && cd Job-Service
nano .env                      # fill it in (see the table above); chmod 600 .env
./deploy/deploy.sh             # builds, migrates and starts pm2 process "workr-job" from deploy/ecosystem.config.js

pm2 startup                    # prints one sudo command - run it, so pm2 starts on reboot
pm2 save
```

nginx: proxy `job.workr.club` to `http://127.0.0.1:<PORT from .env>` (`client_max_body_size 10m;`), then `sudo certbot --nginx -d job.workr.club`.
Security group: open 22 (your IP only), 80, 443 - not the app port.
The RDS security group must allow 3306 from this server's security group.
