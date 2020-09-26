# natssamples

1. Clone the project
2. Run yarn
3. In one terminal run the command: "node subscribe --queue=my-queue foo 'Hey, Good to see you!'"
4. In another terminal run the command: "node publish foo 'Whats Up!'"

In the first terminal you should get the "Whats Up!" message, and in the other you should receive the "Hey, Good to see you".
