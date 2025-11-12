import java.util.*;

public class WrapperDemo {
    void processNumbers(List<Integer> numbers) {
        System.out.println("Original list: " + numbers);
        for (int i = 1; i <= 3; i++) {
            numbers.add(i * 10);
        }
        System.out.println("After autoboxing (added primitive ints): " + numbers);

        int sum = 0;
        for (Integer num : numbers) {
            sum += num;
        }
        System.out.println("Sum of all numbers (after unboxing): " + sum);

        String[] values = {"10", "20", "abc"};
        System.out.println("\nParsing string array: " + Arrays.toString(values));
        for (String val : values) {
            try {
                int parsed = Integer.parseInt(val);
                System.out.println("Parsed value: " + parsed);
            } catch (NumberFormatException e) {
                System.out.println("Cannot parse '" + val + "' — invalid number format!");
            }
        }

        try {
            int max = Collections.max(numbers);
            System.out.println("\nMaximum value in the list: " + max);
        } catch (NoSuchElementException e) {
            System.out.println("List is empty — cannot find maximum.");
        }
    }

    public static void main(String[] args) {
        WrapperDemo demo = new WrapperDemo();
        List<Integer> numberList = new ArrayList<>();
        numberList.add(100);
        numberList.add(Integer.valueOf(200));
        numberList.add(300);

        demo.processNumbers(numberList);

        System.out.println("\nInteger Caching Demonstration:");
        Integer a = Integer.valueOf(100);
        Integer b = Integer.valueOf(100);
        Integer c = Integer.valueOf(200);
        Integer d = Integer.valueOf(200);

        System.out.println("Integer.valueOf(100) == Integer.valueOf(100): " + (a == b));
        System.out.println("Integer.valueOf(200) == Integer.valueOf(200): " + (c == d));

        Double doubleVal1 = Double.valueOf(10.5);
        Double doubleVal2 = 20.5;
        double sumDouble = doubleVal1 + doubleVal2;
        System.out.println("\nDouble examples:");
        System.out.println("Double values: " + doubleVal1 + " and " + doubleVal2);
        System.out.println("Sum (after unboxing): " + sumDouble);

        Boolean bool1 = Boolean.valueOf(true);
        Boolean bool2 = false;
        System.out.println("\nBoolean examples:");
        System.out.println("Boolean values: " + bool1 + " and " + bool2);
        System.out.println("Result of bool1 == bool2: " + (bool1 == bool2));
    }
}
