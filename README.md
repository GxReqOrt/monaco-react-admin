# ProjectName

Write someting meaningful about your project!

## Development workflow

**If it's your first time using `react-admin` then the official docs offer a [30min tutorial](https://marmelab.com/react-admin/Tutorial.html) that's great to get up and running quickly.**

```sh
yarn
```
To get started with the project, run `yarn` in the root directory to install the required dependencies for each package.

```sh
yarn start
```

To run the app in development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

```sh
yarn lint --fix
```

To fix formatting errors.

## CI/CD

This project comes with CI/CD pipelines setup out of the box using Bitbucket Pipelines.

These pipelines are:

* lint every pull request
* build and deploy staging on push
* build and deploy master on push

How do we handle deploys? We do so with AWS S3 and CloudFront. S3 hosts all the static files that make up your build and CloudFront serves them in a way that allows us to set up SSL certificates (HTTPS) and enhance performance because CloudFront is, in its core, a CDN.

These pipelines work if certain variables are set in your repository, required variables are:

* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AWS_DEFAULT_REGION`
* `S3_BUCKET_MASTER`
* `DISTRIBUTION_ID_MASTER`
* `S3_BUCKET_STAGING`
* `DISTRIBUTION_ID_STAGING`

Variables named `S3_BUCKET_<branch>` are just there to hold the name of the bucket created to hold static files, `DISTRIBUTION_ID_<branch>` variables are there to hold the CloudFront distribution ID. Why do we need the latter? Because if you are caching responses to requests received by CloudFront (which you should) you need to invalidate that cache so you get the latest content, if you don't you'll see old content even after a deploy.
