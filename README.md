The project is it capture and analyze user click events on the e-commerce website, 
specifically focusing on instances where users explore product pages but do not complete purchases. 
By monitoring these click events in real-time, the system will attempt to sense the underlying 
sentiment behind users' abandonment of potential transactions. The architecture involves capturing user click events
on the e-commerce website and ingesting them into an Apache Kafka cluster for real-time and fault-tolerant data streaming.
Apache Spark Streaming will consume the event data from Kafka and perform sentiment analysis using Counter Data technique to
check the user's sentiment behind their actions.The processed sentiment data, along with relevant user and product information,
will be stored in an Apache Cassandra database,leveraging its distributed and scalable nature for efficient data storage and retrieval.
The insights derived from this sentiment analysis system can be utilized to identify pain points, optimize product offerings, and enhance the overall shopping experience.

Some of the Essential Commands : 
Start Cassandra :

brew services start cassandra

Create Table :

CREATE TABLE cust_data (fname text , lname text , product text , cnt int ,primary key (fname,lname,product));

Start Kafka : 
bin/zookeeper-server-start.sh config/zookeeper.properties

bin/kafka-server-start.sh config/server.properties

Stop Kafa :

bin/kafka-server-stop.sh

bin/zookeeper-server-stop.sh

 Start spark shell :

bin/spark-shell --packages "com.datastax.spark:spark-cassandra-connector_2.12:3.2.0","org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.1"

Create Kafka Topic :

bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic scds
bin/kafka-topics.sh --list --bootstrap-server localhost:9092

Start Kafka Producer and Consumer :

bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic scds --from-beginning

bin/kafka-console-producer.sh --broker-list localhost:9092 --topic scds

Spark Commands :

import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.streaming._
import org.apache.spark.sql.functions._
import com.datastax.spark.connector._
import com.datastax.spark.connector.cql.CassandraConnector

val spark = SparkSession.builder.appName("KafkaSparkStreaming").config("spark.cassandra.connection.host", "127.0.0.1").getOrCreate()

val df = spark.readStream.format("kafka").option("kafka.bootstrap.servers", "localhost:9092").option("subscribe", "scds").load()

val lines = df.selectExpr("CAST(value AS STRING) as value")

val splitDF = lines.selectExpr("split(value, ',')[0] as fname", "split(value, ',')[1] as lname", "split(value, ',')[2] as product", "split(value, ',')[3] as cnt")

val query = splitDF.writeStream.foreachBatch { (batchDF: org.apache.spark.sql.Dataset[org.apache.spark.sql.Row], batchId: Long) => batchDF.show(false); batchDF.write.format("org.apache.spark.sql.cassandra").options(Map("table" -> "cust_data", "keyspace" -> "sparkdata")).mode("append").save() }.start()
