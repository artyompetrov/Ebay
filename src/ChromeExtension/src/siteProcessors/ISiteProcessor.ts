export interface ISiteProcessor {
    run(): Promise<void>;
}