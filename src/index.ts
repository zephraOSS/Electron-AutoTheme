import * as SunCalc from "suncalc";
import * as cron from "cron";
import ipInfo from "ipinfo";
import ElectronStore from "electron-store";

interface Location {
    latitude: number;
    longitude: number;
}

export class AutoTheme {
    private currentCronJob: cron.CronJob;
    private location: Location;
    private readonly store: ElectronStore<any>;
    private useDark: boolean;

    constructor(func: (useDark: boolean) => void, store?: ElectronStore<any>) {
        this.newAutoTheme(func);

        if (store) this.store = store;
    }

    private async getLocation() {
        if (this.store && this.store.get("electron-autotheme.location")) {
            const date = new Date(
                <string>this.store.get("electron-autotheme.date")
            );

            // Check if date is not older than 48 hours
            if (
                date &&
                date.getTime() + 1000 * 60 * 60 * 48 > new Date().getTime()
            )
                return <Location>this.store.get("electron-autotheme.location");
        }

        try {
            const loc = (await ipInfo()).loc.split(",");

            this.location = {
                latitude: parseFloat(loc[0]),
                longitude: parseFloat(loc[1])
            };

            if (this.store) {
                this.store.set("electron-autotheme.location", this.location);
                this.store.set("electron-autotheme.date", new Date());
            }

            return this.location;
        } catch (e) {
            console.error(e);

            return null;
        }
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
        const location = await this.getLocation();

        if (!location) {
            console.error("Could not get location");

            setTimeout(() => this.newAutoTheme(func), 1000 * 60);

            return;
        }

        const { sunrise, sunset } = this.getSunriseSunset(),
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
        this.useDark = useDark;

        func(useDark);

        const cronJob = new cron.CronJob(cronDate, () => {
            const now = new Date(),
                useDark = now < sunrise || now >= sunset;

            func(useDark);

            this.useDark = useDark;

            this.newAutoTheme(func);
        });

        cronJob.start();

        this.currentCronJob = cronJob;
    }

    public useDarkMode() {
        return this.useDark;
    }

    public stop() {
        this.currentCronJob?.stop();
    }
}
