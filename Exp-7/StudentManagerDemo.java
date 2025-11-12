import java.util.*;

class Student {
    String name;
    int rollNumber;
    double gpa;

    public Student(String name, int rollNumber, double gpa) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.gpa = gpa;
    }

    @Override
    public String toString() {
        return "Student{" +
                "Name='" + name + '\'' +
                ", RollNumber=" + rollNumber +
                ", GPA=" + gpa +
                '}';
    }
}

class StudentManager {
    private ArrayList<Student> students = new ArrayList<>();

    public void addStudent(String name, int rollNumber, double gpa) {
        boolean exists = students.stream().anyMatch(s -> s.rollNumber == rollNumber);
        if (exists) {
            System.out.println("Duplicate roll number ignored: " + rollNumber);
            return;
        }
        students.add(new Student(name, rollNumber, gpa));
        System.out.println("Added: " + name);
    }

    public void searchByName(String name) {
        System.out.println("\nSearch results for \"" + name + "\":");
        students.stream()
                .filter(s -> s.name.equalsIgnoreCase(name))
                .forEach(System.out::println);
    }

    public void removeByRollNumber(int rollNumber) {
        boolean removed = students.removeIf(s -> s.rollNumber == rollNumber);
        if (removed) System.out.println("Removed student with roll number: " + rollNumber);
        else System.out.println("No student found with roll number: " + rollNumber);
    }

    public void sortByGpaDescending() {
        students.sort((s1, s2) -> Double.compare(s2.gpa, s1.gpa));
        System.out.println("\nStudents sorted by GPA (descending):");
        students.forEach(System.out::println);
    }

    public void displayTop3() {
        System.out.println("\nTop 3 Students by GPA:");
        students.stream()
                .sorted((s1, s2) -> Double.compare(s2.gpa, s1.gpa))
                .limit(3)
                .forEach(System.out::println);
    }

    public void printAll() {
        System.out.println("\nAll Students:");
        students.forEach(System.out::println);
    }
}

public class StudentManagerDemo {
    public static void main(String[] args) {
        StudentManager manager = new StudentManager();

        manager.addStudent("Yogesh", 101, 9.1);
        manager.addStudent("Amit", 102, 8.5);
        manager.addStudent("Rohit", 103, 7.8);
        manager.addStudent("Priya", 104, 9.5);
        manager.addStudent("Neha", 105, 8.9);
        manager.addStudent("Ankit", 106, 9.0);
        manager.addStudent("Simran", 107, 9.7);
        manager.addStudent("Ravi", 108, 7.5);
        manager.addStudent("Amit", 102, 8.2);

        manager.printAll();
        manager.searchByName("Priya");
        manager.removeByRollNumber(103);
        manager.printAll();
        manager.sortByGpaDescending();
        manager.displayTop3();
    }
}
