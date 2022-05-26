import * as SunCalc from "suncalc";
import * as cron from "cron";
import ipInfo from "ipinfo";

export class AutoTheme {
    private currentCronJob: cron.CronJob;
    private location: { latitude: number; longitude: number };

    constructor(func: (useDark: boolean) => void) {
        this.newAutoTheme(func);
    }

    private async getLocation() {
        const loc = (await ipInfo()).loc.split(",");

        this.location = {
            latitude: parseFloat(loc[0]),
            longitude: parseFloat(loc[1])
        };

        return this.location;
    }

    private getSunriseSunset(
        latitude: number = this.location.latitude,
        longitude: number = this.location.longitude,
        date: Date = new Date()
    ) {
        const times = SunCalc.getTimes(date, latitude, longitude);

        return {
            sunrise: times.sunrise,
            sunset: times.sunset
        };
    }

    private async newAutoTheme(func: Function): Promise<void> {
        const location = await this.getLocation(),
            { sunrise, sunset } = this.getSunriseSunset(),
            now = new Date(),
            useDark = now < sunrise || now >= sunset,
            cronDate: Date = useDark
                ? this.getSunriseSunset(
                      location.latitude,
                      location.longitude,
                      new Date(now.getTime() + 1000 * 60 * 60 * 24)
                  ).sunrise
                : sunset;

        this.currentCronJob?.stop();

        const cronJob = new cron.CronJob(cronDate, () => {
            const now = new Date(),
                useDark = now < sunrise || now >= sunset;

            func(useDark);

            this.newAutoTheme(func);
        });

        cronJob.start();

        this.currentCronJob = cronJob;
    }
}
