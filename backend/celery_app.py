from celery import Celery
import os

broker = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
celery_app = Celery('smartlearn', broker=broker)

@celery_app.task
def dummy_task(x):
    return x * 2
