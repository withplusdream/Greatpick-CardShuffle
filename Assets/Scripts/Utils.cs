using System.Linq;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
public class Utils
{
    public static string[] blindedValue = new string[]
    {
        "A1",
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
        "B1",
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
        "B7",
        "B8",
        "C1",
        "C2",
        "C3",
        "C4",
        "C5",
        "C6",
        "C7",
        "C8",
        "D1",
        "D2",
        "D3",
        "D4",
        "D5",
        "D6",
        "D7",
        "D8",
    };
    public static void Shuffle<T>(List<T> list)
    {
        System.Random random = new System.Random();
        int n = list.Count;
        while (n > 1)
        {
            int k = random.Next(n);
            n--;
            T temp = list[k];
            list[k] = list[n];
            list[n] = temp;
        }
    }
    public static int GetTotalCost(List<int> list)
    {
        var sorted = list.OrderByDescending(x => x);
        Queue<int> lowCostQueue = new Queue<int>();
        foreach (var val in sorted)
        {
            lowCostQueue.Enqueue(val);
        }

        int result = 0;
        int current = lowCostQueue.Dequeue();
        result += current;
        while (lowCostQueue.Count > 0)
        {
            var val = lowCostQueue.Dequeue();
            if (current - val == 1)
            {
                current = val;
            }
            else
            {
                result += val;
                current = val;
            }
        }
        return result;
    }
    public static List<List<int>> GetSplitedList(List<int> list)
    {
        if (list.Count == 0)
        {
            return new List<List<int>>() { list };
        }

        var result = new List<List<int>>();


        var sorted = list.OrderByDescending(x => x);
        Queue<int> lowCostQueue = new Queue<int>();
        foreach (var val in sorted)
        {
            lowCostQueue.Enqueue(val);
        }
        List<int> currentList;
        var newList = new List<int>();
        currentList = newList;
        result.Add(newList);

        int current = lowCostQueue.Dequeue();
        newList.Add(current);

        while (lowCostQueue.Count > 0)
        {
            var val = lowCostQueue.Dequeue();
            if (current - val == 1)
            {
                currentList.Add(val);
                //pass(add)
                current = val;
            }
            else
            {
                currentList = new List<int>();
                result.Add(currentList);
                currentList.Add(val);
                current = val;
            }
        }
        return result;
    }
    public static IEnumerator WaitForInvoke(System.Action callback, float delay)
    {
        yield return new WaitForSeconds(delay);
        callback?.Invoke();
    }
}