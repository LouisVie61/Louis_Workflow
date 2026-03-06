import "dotenv/config";
import { Container } from "./src/infrastructure/di/Container";

const cli = Container.buildCLI();
cli.run(process.argv.slice(2));