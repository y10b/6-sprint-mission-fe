export const asyncHandler = (handler) => {
    return async (req, res) => {
        try {
            await handler(req, res);
        } catch (e) {
            switch (e.name) {
                case 'ValidationError':
                    res.status(400).send({ message: e.message });
                    break;
                case 'CastError':
                    res.status(404).send({ message: "ID를 찾을 수 없습니다" });
                    break;
                default:
                    res.status(500).send({ message: e.message });
                    break;
            }
        }
    };
};
