# recover-password

Simple recover password system in NodeJS

## How it work

When there is a request on _/lost-password_ the server generate a token (using JWT) that contains the username. The token will expires in 15 min.

Password can be changed with a POST request to _/lost-password/{GENERATED-TOKEN}_

## Packages

-   express
-   jsonwebtoken
-   bcrypt
