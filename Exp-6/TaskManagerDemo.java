import java.util.*;

class Task {
    String description;
    Integer priority;

    public Task(String description, int priority) {
        this.description = description;
        this.priority = priority;
    }

    @Override
    public String toString() {
        return "Task{" +
                "Description='" + description + '\'' +
                ", Priority=" + priority +
                '}';
    }
}

class TaskManager {
    private Collection<Task> tasks = new ArrayList<>();
    private HashSet<String> taskDescriptions = new HashSet<>();
    private HashSet<String> tags = new HashSet<>();

    public void addTask(String description, int priority) {
        if (taskDescriptions.contains(description)) {
            System.out.println("Duplicate task ignored: " + description);
            return;
        }
        Task newTask = new Task(description, priority);
        tasks.add(newTask);
        taskDescriptions.add(description);
        System.out.println("Added: " + newTask);
    }

    public void addTag(String tag) {
        if (tags.add(tag)) {
            System.out.println("Tag added: " + tag);
        } else {
            System.out.println("Duplicate tag ignored: " + tag);
        }
    }

    public void sortTasksByPriority() {
        List<Task> sortedList = new ArrayList<>(tasks);
        sortedList.sort(Comparator.comparingInt(t -> t.priority));
        System.out.println("\nTasks sorted by priority:");
        for (Task t : sortedList) {
            System.out.println(t);
        }
    }

    public void printAllTasks() {
        System.out.println("\nAll Tasks:");
        for (Task t : tasks) {
            System.out.println(t);
        }
    }

    public void printTags() {
        System.out.println("\nAll Tags: " + tags);
    }
}

public class TaskManagerDemo {
    public static void main(String[] args) {
        TaskManager manager = new TaskManager();

        manager.addTask("Complete Java assignment", 2);
        manager.addTask("Prepare presentation", 1);
        manager.addTask("Buy groceries", 3);
        manager.addTask("Exercise", 4);
        manager.addTask("Complete Java assignment", 2);

        manager.addTag("Work");
        manager.addTag("Personal");
        manager.addTag("Urgent");
        manager.addTag("Work");

        manager.printAllTasks();
        manager.printTags();
        manager.sortTasksByPriority();

        System.out.println("\n--- Adding tasks concurrently (multithreading demo) ---");
        Thread t1 = new Thread(() -> manager.addTask("Read a book", 5));
        Thread t2 = new Thread(() -> manager.addTask("Clean desk", 2));
        Thread t3 = new Thread(() -> manager.addTask("Pay bills", 1));

        t1.start();
        t2.start();
        t3.start();

        try {
            t1.join();
            t2.join();
            t3.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        manager.printAllTasks();
    }
}
