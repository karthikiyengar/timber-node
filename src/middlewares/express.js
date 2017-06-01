// import transform from '../transform'
import compose from 'composable-middleware'
import addRequestId from 'express-request-id'
import formatter from '../utils/formatter'
// import console from 'console';

/*
 * The TimberExpress middleware takes care of automatically logging
 * each http event with the appropriate context events attached.
 * Currently what's logged is:
 * - http request event
 * - http response event
 *
 * TODO: allow additional context items (i.e. user) to be attached
*/
const TimberExpress = (req, res, next) => {
  // save a reference of the start time so that we can determine
  // the amount of time each http request takes
  req.start_time = (new Date()).getTime()

  // destructure the request object for ease of use
  const {
    headers: { host, ...headers },
    method,
    id: request_id, path,
    protocol: scheme
  } = req

  // determine the ip address of the client
  // https://stackoverflow.com/a/10849772
  const remote_addr = headers['x-forwarded-for'] || req.connection.remoteAddress

  // add the http context information to the metadata object
  const metadata = {
    context: {
      http: {
        method,
        request_id,
        remote_addr,
        path
      }
    }
  }

  // add the http_server_request event to the metadata object
  metadata.event = {
    server_side_app: {
      http_server_request: {
        method,
        request_id,
        path,
        host,
        scheme
      }
    }
  }

  // add an event to get  triggered when the request finishes
  // this event will send the http_client_response event to timber
  req.on('end', () => {
    // calculate the duration of the http request
    const time_ms = ((new Date()).getTime() - req.start_time)

    // add the http_server_response event to the metadata object
    metadata.event = {
      server_side_app: {
        http_server_response: {
          request_id,
          time_ms,
          status: res.statusCode,
          body: res.body
        }
      }
    }
    console.info(JSON.stringify(metadata));
    // log the http response with metadata
    console.info(formatter(`Outgoing HTTP response ${res.statusCode} in ${time_ms}ms ${req.path}`, metadata))
  })

  // log the http request with metadata
  console.info(formatter(`Outgoing HTTP request [${req.method}] ${req.path}`, metadata))
  next()
}

// compose multiple middlewares as a single express middleware
// - addRequestId takes care of appending a unique uuid to each request
// - TimberExpress is the official timber middleware for express
const middleware = compose(
  addRequestId(),
  TimberExpress
)

export default middleware
