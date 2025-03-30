import {ClientsFactory} from "../clients/ClientsFactory";

export interface ISiteProcessor {
    run(): Promise<void>;
}