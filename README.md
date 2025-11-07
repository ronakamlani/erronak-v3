# Personal portfolio

[![Site preview](/public/social-image.png)](https://www.erronak.com)

This portfolio showcases engineering and product work from Ronak Amlani — a Senior MERN Stack Engineer and Full-Stack Architect. Projects include scalable web and SaaS platforms, interactive frontend experiences, and cloud-native infrastructure. Built with [Next.js](https://nextjs.org/), [Three.js](https://threejs.org/), and [Framer Motion](https://www.framer.com/motion/).

View the live site or check out a live version of the components storybook.

## Install & run

Make sure you have nodejs `18.0.0` or higher and npm `8.6.0` or higher installed. Install dependencies with:

```bash
npm install
```

Once it's done start up a local server with:

```bash
npm run dev
```

To view the components storybook:

```bash
npm run storybook
```

To create a production build:

```bash
npm run build
```

## Deployment

I've set up the site using AWS for hosting and serverless functions. You'll need an AWS account and the AWS CLI installed in order to deploy.

Deploy the site to s3:

```bash
npm run deploy
```

Deploy serverless functions:

```bash
cd functions
```

```bash
npm run deploy:api
```