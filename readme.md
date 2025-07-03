<p align="center">
  <a href="https://www.frontendmentor.io/challenges">
    <img alt="frontendmentor" src="https://www.frontendmentor.io/static/images/logo-desktop.svg" width="300" />
  </a>
</p>
<h1 align="center">
  Jobs advertisement app
</h1>

[ADVANCED 4] Project from learning path <a href="https://www.frontendmentor.io/challenges/devjobs-web-app-HuvC_LP4l" rel="noreferrer"  target="_blank">https://www.frontendmentor.io/challenges</a>.

<div>
  <h3>Description:</h3>
  <p>
  This is a fullstack project written entirely in Typescript. It is managed by a mono repository (<a href="https://turbo.build/" rel="noreferrer"  target="_blank">TurboRepo</a>), the frontend uses <a href="https://react.dev/" rel="noreferrer"  target="_blank">ReactJS</a> bundled by vite, while the backend uses <a href="https://nestjs.com/" rel="noreferrer"  target="_blank">NestJS</a> (a framework for node.js) with a TypeORM-based PostreSQL database.
  </p>

  <p>
    Application also use <a href="https://docs.docker.com/" rel="noreferrer" target="_blank">Docker</a> and is splited for 4 containers (frontend, backend, bp-pg-db and pgadmin-portal)
  </p>

  <p>Provides such functionalities as:</p>

  <ul>
    <li> User registration and authorization using JWT token in server-side cookies. When the user is signed in, the user object is returned and stored in browser session storage. A token refresh function has also been implemented (when the jwt token expires, it checks the refreshToken stored for the signed in user in the database and returns a new jwt token).</li>
    <li>
      User panel (administration). When a user is signed in, simple information about the user is displayed, and the user can also access the offer archive, list of their offers and dictionaries. Each of these functions is described below.
    </li>
    <li>Management of job offers. After sign in, the user has the ability to manage job offers from the User Panel.</br> From this level, the user can manage these offers (CRUD principle) and archive their offers.
    </li>
    <li>
    Manage definitions of companies and contract types. When adding a new job offer, a new company or contract type can be added. The user can manage these entries (CRUD principle) from the dictionaries available in the User Panel.
    </li>
  </ul>

  <h3>Techstack:</h3>
  <ul>
    <li>Typescript </li>
    <li>React</li>
    <li>NestJS </li>
    <li>TypeORM </li>
    <li>PostgreSQL</li>
    <li>#passport package </li>
    <li>#motionOne animation package </li>
    <li>#vite</li>
    <li>#Sass modules</li>
  </ul>
  <p>
    <strong>@TODO!! I've changed the host from AWS to google cloud, and there is still needs to configure backend communication with frontend (right now it return errors - it will be finished soon)</strong>
    Link to my project website:
    <a href="https://jobs-portal-frontend-1080803823360.europe-west1.run.app/dashboard" rel="noreferrer" target="_blank">DEMO</a>
  <p>
  <p>
    Link to frontend mentor project:
    <a href="https://www.frontendmentor.io/challenges/devjobs-web-app-HuvC_LP4l" rel="noreferrer"  target="_blank">https://www.frontendmentor.io/challenges/  devjobs-web-app-HuvC_LP4l</a>
  <p>
</div>
