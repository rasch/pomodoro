# pomodoro

🍅 pomodoro timer in the browser tab

All configuration is done in the query string of the URL. Create your own
interval timers and bookmark them!

| parameter | default | range   | description                                 |
|:---------:|:-------:|:-------:|:-------------------------------------------:|
| c         | 0       | 0-99    | number of pomodoros completed               |
| w         | 1500    | 1-86399 | work time in seconds                        |
| b         | 300     | 1-86399 | break time in seconds                       |
| l         | 1200    | 1-86399 | long break in seconds (every 4th break)     |
| x         | 3000    | 1-86399 | extended break in seconds (every 8th break) |
| v         | 0       | 0-100   | beep volume in percent                      |

## examples

- Pomodoro timer: The default pomodoro timer has 25 minute work periods and 5
  minute breaks. Every 4th break is 20 minutes and every 8th break is 50
  minutes. Note that the beep volume is set to 15% in this example.
  The volume defaults to 0 and isn't audible unless it's set.

      https://rasch.co/pt/?v=15

- Tabata timer: 8 cycles of 20 seconds of work and 10 seconds of rest for a
  total of 3 minutes and 50 seconds and then followed by an extended 4 minute
  break before starting another round. The beep volume is set to 25%, which may
  need to be adjusted for personal preferences.

      https://rasch.co/pt/?w=20&b=10&l=10&x=240&v=25

- Countdown timer: Countdown from 23 hours, 59 minutes, and 59 seconds. Note
  the breaks will still occur and the countdown will begin again.

      https://rasch.co/pt/?w=86399&v=15

## why no stop/pause button?

This timer is specifically designed for pomodoros and tabatas which don't allow
pausing. If you have to pause, you actually have to start over. With this timer
the query string parameter `c` can be used to restart the round that was
interrupted. For example, to start at round 5:

    https://rasch.co/pt/?v=15&c=5

## run locally

The website is easy to run locally since it's static with no build step.

```sh
git clone https://github.com/rasch/pomodoro.git
cd pomodoro

# serve with static web server such as darkhttpd
darkhttpd .
```

## cli

There is also a command line node application available. The `play` command from
the `sox` package needs to be installed for the notification sound to work.

```sh
npm install -g @rasch/pt
pt -h
```
