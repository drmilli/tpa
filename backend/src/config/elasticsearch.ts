import { Client } from '@elastic/elasticsearch';
import { logger } from '../utils/logger';

export const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});

export const connectElasticsearch = async () => {
  try {
    const health = await esClient.cluster.health();
    logger.info(`✅ Connected to Elasticsearch - Status: ${health.status}`);
  } catch (error) {
    logger.warn('Elasticsearch not available:', error);
  }
};

export const createPoliticianIndex = async () => {
  const indexExists = await esClient.indices.exists({ index: 'politicians' });

  if (!indexExists) {
    await esClient.indices.create({
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
    logger.info('Created politicians index');
  }
};
