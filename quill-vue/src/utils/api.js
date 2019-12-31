class Api {
    constructor() {}
    get() {
        throw new Error('Abstract methods must be implemented');
    }

    post() {
        throw new Error('Abstract methods must be implemented');
    }
    getTopics() {
        return this.get('/topics');
    }
}
export default Api;
