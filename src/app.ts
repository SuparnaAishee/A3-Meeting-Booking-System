import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { UserRoutes } from './app/modules/user/user.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
const app:Application = express();
const port = 3000;

//parsers
app.use(express.json())
//app.use(cors())

app.use('/api', router);


app.use(globalErrorHandler);
app.use(notFound);

app.get("/", (req:Request, res:Response) => {
  res.send("Book Your Meeting Room");
});



export default app;