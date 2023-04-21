using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ChannelPassword : MonoBehaviour
{
    public InputField inputField;

    void Start()
    {

    }

    public void SendPassword()
    {
        string password = inputField.text;

        Debug.Log("Password: " + password);
        if (password != "")
        {
            ServerManager.Instance.SendChannelPassword(password);
        }
    }
}
