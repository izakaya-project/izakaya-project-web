git checkout -b for-deploy
npm run product
git add .
git commit -m 'deploy commit'
git push heroku master
git checkout master
git branch -D for-deploy
