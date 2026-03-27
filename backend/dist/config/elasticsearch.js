"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoliticianIndex = exports.connectElasticsearch = exports.esClient = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
const logger_1 = require("../utils/logger");
exports.esClient = new elasticsearch_1.Client({
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});
const connectElasticsearch = async () => {
    try {
        const health = await exports.esClient.cluster.health();
        logger_1.logger.info(`✅ Connected to Elasticsearch - Status: ${health.status}`);
    }
    catch (error) {
        logger_1.logger.warn('Elasticsearch not available:', error);
    }
};
exports.connectElasticsearch = connectElasticsearch;
const createPoliticianIndex = async () => {
    const indexExists = await exports.esClient.indices.exists({ index: 'politicians' });
    if (!indexExists) {
        await exports.esClient.indices.create({
            index: 'politicians',
            body: {
                mappings: {
                    properties: {
                        firstName: { type: 'text' },
                        lastName: { type: 'text' },
                        fullName: { type: 'text' },
                        biography: { type: 'text' },
                        partyAffiliation: { type: 'keyword' },
                        state: { type: 'keyword' },
                        officeType: { type: 'keyword' },
                        performanceScore: { type: 'float' },
                        createdAt: { type: 'date' },
                    },
                },
            },
        });
        logger_1.logger.info('Created politicians index');
    }
};
exports.createPoliticianIndex = createPoliticianIndex;
//# sourceMappingURL=elasticsearch.js.map