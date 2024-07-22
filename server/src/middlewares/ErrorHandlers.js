const ErrorHandler = (err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).send('Something broke!');
  };
  
  export default ErrorHandler;
  