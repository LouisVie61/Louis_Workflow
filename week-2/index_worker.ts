import "dotenv/config";
import { WorkerContainer } from "./src/infrastructure/di/WorkerContainer";

const worker = WorkerContainer.buildWorker();
worker.start(5000);