package your_project_name;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.scene.Scene;
import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.LineChart;
import javafx.scene.chart.XYChart;
import javafx.stage.Stage;
import yahoofinance.Stock;
import yahoofinance.YahooFinance;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Timer;
import java.util.TimerTask;

public class App extends Application {
    private static final String SYMBOL = "^DJI"; // Symbol for Dow Jones Industrial Average
    private static final Queue<Double> stockPrices = new LinkedList<>();
    private static final Queue<Long> timestamps = new LinkedList<>();
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    private static final int MAX_ENTRIES = 20; // Limit the number of points on the graph
    private XYChart.Series<Number, Number> series;

    @Override
    public void start(Stage primaryStage) {
        // Create the x and y axes
        NumberAxis xAxis = new NumberAxis();
        NumberAxis yAxis = new NumberAxis();
        xAxis.setLabel("Time (seconds)");
        yAxis.setLabel("Stock Price");

        // Create the line chart
        LineChart<Number, Number> lineChart = new LineChart<>(xAxis, yAxis);
        lineChart.setTitle("Dow Jones Industrial Average (DJIA) Stock Price");
        series = new XYChart.Series<>();
        series.setName("Stock Prices");
        lineChart.getData().add(series);

        // Set up the scene and stage
        Scene scene = new Scene(lineChart, 800, 600);
        primaryStage.setScene(scene);
        primaryStage.setTitle("Stock Price Tracker");
        primaryStage.show();

        // Start fetching stock prices
        startStockPriceFetcher();
    }

    private void startStockPriceFetcher() {
        Timer timer = new Timer();
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                fetchAndUpdateStockData();
            }
        }, 0, 5000); // Fetch data every 5 seconds
    }

    private void fetchAndUpdateStockData() {
        try {
            Stock stock = YahooFinance.get(SYMBOL);
            if (stock != null && stock.getQuote() != null) {
                double price = stock.getQuote().getPrice().doubleValue();
                long timestamp = System.currentTimeMillis() / 1000;

                // Add data to queues
                stockPrices.offer(price);
                timestamps.offer(timestamp);

                // Limit the size of the data stored
                if (stockPrices.size() > MAX_ENTRIES) {
                    stockPrices.poll();
                    timestamps.poll();
                }

                // Update the graph
                Platform.runLater(() -> updateGraph());
            } else {
                System.err.println("Failed to fetch stock data for symbol: " + SYMBOL);
            }
        } catch (IOException e) {
            System.err.println("Error fetching stock data: " + e.getMessage());
        }
    }

    private void updateGraph() {
        series.getData().clear();
        Long firstTimestamp = timestamps.peek();
        if (firstTimestamp == null) {
            return;
        }
        for (int i = 0; i < stockPrices.size(); i++) {
            double price = ((LinkedList<Double>) stockPrices).get(i);
            long timestamp = ((LinkedList<Long>) timestamps).get(i) - firstTimestamp;
            series.getData().add(new XYChart.Data<>(timestamp, price));
        }
    }

    public static void main(String[] args) {
        launch(args);
    }
}
