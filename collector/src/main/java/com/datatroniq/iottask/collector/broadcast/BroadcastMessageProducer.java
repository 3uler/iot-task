package com.datatroniq.iottask.collector.broadcast;

import com.datatroniq.iottask.collector.model.TelemitryData;
import com.google.gson.Gson;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class BroadcastMessageProducer {

    private final RabbitTemplate rabbitTemplate;
    private Gson gson = new Gson();
    private long startTime = System.currentTimeMillis();
    private List<Double> thetas = Arrays.asList(0.01, 0.02, 0.04, 0.06, 0.08);

    @Autowired
    public BroadcastMessageProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void send() {

        String telemetryJsonObject = gson.toJson(this.generateData());
        this.rabbitTemplate.convertAndSend(BroadcastConfig.exchangeName, "", telemetryJsonObject);
    }

    private TelemitryData generateData() {
        ArrayList<Double> datapoints = new ArrayList<>();
        long timestamp = System.currentTimeMillis();
        for (Double theta: thetas) {
            Double timedelta = new Long(startTime - timestamp).doubleValue();
            datapoints.add(Math.sin(theta * timedelta));
        }

        return new TelemitryData(System.currentTimeMillis(), datapoints);
    }
}
