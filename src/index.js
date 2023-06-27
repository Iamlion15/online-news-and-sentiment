import http from 'http';
import app from './app';
import config from './helpers/configEnv';
const server=http.createServer(app);
const port=process.env.PORT || 6000

server.listen(port,()=>{
    console.log(`server started at  ${port}`)
})