
import productionPointsDB from "../assets/production/points.json";
import stagingPointsDB from "../assets/staging/points.json";
import developmentPointsDB from "../assets/development/points.json";

let pointsDB;
switch (process.env.NEXT_PUBLIC_ENVIRONMENT) {
    case 'production':
        pointsDB = productionPointsDB;
        break;
    case 'staging':
        pointsDB = stagingPointsDB;
        break;
    case 'development':
    default:
        pointsDB = developmentPointsDB;
}

export default pointsDB;