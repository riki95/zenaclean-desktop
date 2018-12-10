
export class NewReport {
    public ts: Date;
    public today: string;
    public hour: string;
    public address: string;

    constructor(public title: string,
                public description: string,
                public picture: string,
                public latitude: number,
                public longitude: number
    ) {

        this.ts = new Date();
        this.today = this.ts.getDate() + '/' + this.ts.getMonth() + '/' + this.ts.getFullYear();
        this.hour = this.ts.getHours() + ':' + this.ts.getMinutes() + ':' + this.ts.getSeconds();
        this.address = '' + latitude + ' - ' + longitude;

    }

}