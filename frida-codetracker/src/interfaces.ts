interface TrackingData{
    [key:string]:{
        time: number;
        lastStart: number | null;
    };
}

interface ActivityData{
    [key:string]:number
};

interface MostUsedFileData{
    name:string;
    time:number;
}

export { TrackingData, ActivityData, MostUsedFileData};