export interface ISiteProcessor {
    run(): Promise<void>;
    
    breakAfterSearchProcessor: boolean;
}