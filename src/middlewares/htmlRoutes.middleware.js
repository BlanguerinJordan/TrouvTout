export default function htmlRoutes(req, res, next) {
  const page = req.params.page;

  res.sendFile(`${page}.html`, { root: "public" }, (err) => {
    if (err) {
      next();
    }
  });
}
