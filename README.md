# React CI Pipeline — GitHub Actions Assignment

> **Module 5 Assignment:** Automating the build and test process of a React application using GitHub Actions with a self-hosted runner on AWS EC2.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Concepts Explained](#concepts-explained)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Guide](#setup-guide)
- [Workflow File](#workflow-file)
- [Pipeline Results](#pipeline-results)
- [Debugging a Failure](#debugging-a-failure)

---

## Project Overview

This project demonstrates a simple **Continuous Integration (CI) pipeline** using GitHub Actions. The pipeline automatically triggers whenever code is pushed to the `development` branch. It runs on a **self-hosted runner** provisioned on an **AWS EC2 instance** (Ubuntu 22.04).

The pipeline performs the following steps on every push:

1. Checks out the latest code
2. Sets up Node.js
3. Installs dependencies (`npm ci`)
4. Runs tests (`npm test`)
5. Builds the React application (`npm run build`)
6. Verifies the build output

---

## Concepts Explained

### What is CI/CD?

**Continuous Integration (CI)** is the practice of automatically testing and validating code every time a developer pushes a change to a shared repository. Instead of testing manually before deployment, the process runs automatically through a pipeline.

**Continuous Delivery/Deployment (CD)** extends CI by automatically deploying the validated code to a staging or production environment.

**Benefits:**

- Catches bugs early — before they reach production
- Eliminates manual, error-prone build and test steps
- Gives every team member instant feedback on their changes
- Keeps the codebase in a deployable state at all times

---

### What is a Self-Hosted Runner?

A **self-hosted runner** is a machine that _you_ control and register with GitHub, which GitHub Actions then uses to execute your workflow jobs.

|                 | GitHub-Hosted Runner   | Self-Hosted Runner                    |
| --------------- | ---------------------- | ------------------------------------- |
| **Managed by**  | GitHub                 | You (your own server)                 |
| **Environment** | Fresh VM each run      | Persistent, configurable              |
| **Cost**        | Free tier limits apply | Pay only for your server              |
| **Control**     | Limited                | Full control                          |
| **Use case**    | Quick public projects  | Custom environments, private networks |

In this assignment, an **AWS EC2 instance** (Ubuntu 22.04, `t2.micro`) acts as the self-hosted runner. The GitHub Actions runner agent is installed and registered on this EC2 instance and runs as a background service.

---

### How the Workflow Executes

The execution flow from a `git push` to a completed pipeline:

```
Developer pushes to `development` branch
        │
        ▼
GitHub detects the push event
        │
        ▼
GitHub matches the event to the workflow trigger
(on: push: branches: [development])
        │
        ▼
GitHub queues a job and looks for an available runner
matching `runs-on: self-hosted`
        │
        ▼
EC2 runner picks up the job
        │
        ▼
Runner executes each step in order:
  1. Checkout code
  2. Set up Node.js
  3. npm ci
  4. npm test
  5. npm run build
  6. ls -la build/
        │
        ▼
Results reported back to GitHub
(Pass ✅ or Fail ❌ visible in Actions tab)
```

---

## Tech Stack

| Layer           | Technology                       |
| --------------- | -------------------------------- |
| Application     | React (Create React App)         |
| CI Platform     | GitHub Actions                   |
| Runner          | AWS EC2 — Ubuntu 22.04, t2.micro |
| Runtime         | Node.js 20                       |
| Package Manager | npm                              |

---

## Project Structure

```
react-ci-demo/
├── .github/
│   └── workflows/
│       └── ci.yml          ← GitHub Actions workflow definition
├── public/
├── src/
│   ├── App.js
│   ├── App.test.js
│   └── index.js
├── package.json
└── README.md
```

---

## Setup Guide

### Prerequisites

- AWS account with an EC2 instance running Ubuntu 22.04
- GitHub account
- Node.js installed locally

### Step 1 — Clone and push to `development` branch

```bash
npx create-react-app react-ci-demo
cd react-ci-demo
git init
git remote add origin https://github.com/YOUR_USERNAME/react-ci-demo.git
git checkout -b development
git add .
git commit -m "initial commit"
git push -u origin development
```

### Step 2 — Launch EC2 and install Node.js

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Install Node.js 20 on EC2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3 — Register self-hosted runner on EC2

Go to your GitHub repo → **Settings → Actions → Runners → New self-hosted runner** → select **Linux / x64**.

Run the commands shown on that page on your EC2 instance:

```bash
mkdir actions-runner && cd actions-runner

# Download runner
curl -o actions-runner-linux-x64-2.317.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.317.0/actions-runner-linux-x64-2.317.0.tar.gz

tar xzf ./actions-runner-linux-x64-2.317.0.tar.gz

# Configure (use your repo URL and token from the GitHub page)
./config.sh --url https://github.com/YOUR_USERNAME/react-ci-demo \
  --token YOUR_TOKEN_HERE

# Install and start as a background service
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status
```

After this, the runner should appear as **Idle** in GitHub → Settings → Actions → Runners.

### Step 4 — Add the workflow file and push

```bash
mkdir -p .github/workflows
# Create ci.yml (see Workflow File section below)
git add .github/
git commit -m "add CI workflow"
git push origin development
```

---

## Workflow File

`.github/workflows/ci.yml`

```yaml
name: React CI Pipeline

on:
  push:
    branches:
      - development

jobs:
  build-and-test:
    name: Build & Test React App
    runs-on: self-hosted

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --watchAll=false --passWithNoTests

      - name: Build the app
        run: npm run build

      - name: Confirm build output
        run: ls -la build/
```

**Key configuration decisions:**

| Config                | Value            | Reason                                                |
| --------------------- | ---------------- | ----------------------------------------------------- |
| `on: push: branches`  | `development`    | Triggers only on the development branch as required   |
| `runs-on`             | `self-hosted`    | Uses the EC2 runner, not GitHub's servers             |
| `actions/checkout@v4` | v4               | Checks out the pushed code onto the runner            |
| `npm ci`              | (vs npm install) | Faster, reproducible installs using package-lock.json |
| `--watchAll=false`    | flag             | Runs tests once and exits (CI-safe mode)              |

---

## Pipeline Results

### ✅ Successful Run

After pushing the workflow to the `development` branch, the pipeline runs automatically on the EC2 runner and completes all steps successfully.

---

## Debugging a Failure

To demonstrate pipeline failure and debugging, a deliberate error was introduced in `src/App.test.js`:

```js
test("intentional fail", () => {
  expect(true).toBe(false); // always fails
});
```

**Reading the failure logs:**

In the GitHub Actions tab → click the failed run → click the job name → expand the **Run tests** step. The log shows:

```
● intentional fail

  expect(received).toBe(expected)

  Expected: false
  Received: true
```

This tells us exactly which test failed and why. The fix is to correct the assertion and push again.

![Pipeline run](@file:screenshot.png)
