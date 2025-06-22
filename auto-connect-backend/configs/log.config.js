import pino from "pino"
import elasticFormat from "@elastic/ecs-pino-format"

const LOG = pino(elasticFormat())

export default LOG