using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ManagerLogin : MonoBehaviour
{
    public InputField IDInputField;
    public InputField PasswordInputField;


    public void SendLogin()
    {
        string id = IDInputField.text;
        string password = PasswordInputField.text;

        ServerManager.Instance.SendLogin(id, password);
    }
    //tab키 누르면 칸 바뀌는 기능
    void Update()
    {
        // if (IDInputField.isFocused == true)
        // {
        //     if (Input.GetKeyDown(KeyCode.Tab))
        //     {
        //         PasswordInputField.Select();
        //     }
        // }

        if (Input.GetKeyDown(KeyCode.Tab))
        {
            PasswordInputField.Select();
        }

    }
}
