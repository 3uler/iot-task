package com.datatroniq.iottask.collector.model;

import java.util.List;

public class TelemitryData {
    private long timestamp;
    private List<Double> datapoints;

    public TelemitryData(long timestamp, List<Double> datapoints) {
        this.timestamp = timestamp;
        this.datapoints = datapoints;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public List<Double> getDatapoints() {
        return datapoints;
    }
}
