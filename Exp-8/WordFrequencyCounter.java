import java.util.*;
import java.util.concurrent.*;

class WordCounter implements Runnable {
    private final ConcurrentHashMap<String, Integer> map;
    private final String paragraph;

    public WordCounter(ConcurrentHashMap<String, Integer> map, String paragraph) {
        this.map = map;
        this.paragraph = paragraph;
    }

    @Override
    public void run() {
        String[] words = paragraph.toLowerCase().split("\\W+");
        for (String word : words) {
            if (!word.isEmpty()) {
                map.merge(word, 1, Integer::sum);
                System.out.println(Thread.currentThread().getName() + " updated: " + word);
            }
        }
    }
}

public class WordFrequencyCounter {
    public static void main(String[] args) {
        ConcurrentHashMap<String, Integer> wordMap = new ConcurrentHashMap<>();

        String p1 = "Java supports multithreading and concurrency with thread safety in mind.";
        String p2 = "Thread safety is crucial when using collections in concurrent Java programs.";
        String p3 = "In concurrent environments, thread safety and synchronization prevent issues.";
        String p4 = "Java concurrent collections make thread safety simpler and more efficient.";

        Thread t1 = new Thread(new WordCounter(wordMap, p1), "Thread-1");
        Thread t2 = new Thread(new WordCounter(wordMap, p2), "Thread-2");
        Thread t3 = new Thread(new WordCounter(wordMap, p3), "Thread-3");
        Thread t4 = new Thread(new WordCounter(wordMap, p4), "Thread-4");

        t1.start();
        t2.start();
        t3.start();
        t4.start();

        try {
            t1.join();
            t2.join();
            t3.join();
            t4.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("\nFinal Word Frequency (sorted by count):");
        wordMap.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue(Comparator.reverseOrder()))
                .forEach(entry -> System.out.println(entry.getKey() + " : " + entry.getValue()));
    }
}
