import { Observable } from "rxjs";

export interface ExitPage{
    onExit:()=>Observable<boolean> | Promise<boolean> | boolean;
}