export default (role) => {
	return (req, res, next) => {
		if (req.user.role !== role) {
			return res.sendError(403, "Access denied");
		}
		next();
	};
};
