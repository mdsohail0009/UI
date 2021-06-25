export const formData = [
  {
    id: "aboutme",
    dataType: "string",
    validations: [
      {
        type: "required",
        params: ['Enter about me']
      }
    ]
  },
    {
      id: "FirstName",
      dataType: "string",
      validations: [
        {
          type: "required",
          params: ['Enter first name']
        },
        {
          type: "max",
          params: [15, "First Name cannot be more than 15 characters"]
        },
      ]
    },
    {
      id: "LastName",
      dataType: "string",
      validations: [
        {
          type: "required",
          params: ['Enter last name']
        }
      ]
    },
    {
      id: "College",
      dataType: "string",
      validations: [
        {
          type: "required",
          params: ['select university']
        }
      ]
    },
    {
      id: "Email",
      dataType: "string",
      validations: [
        {
          type: "required",
          params: ['Enter Email']
        },
        {
          type: "email",
          params: ['Email must be a valid']
        },
      ]
    },
    {
      id: "Date",
      dataType: "string",
      validations: [
        {
          type: "required",
          params: ['Enter Date']
        }
      ]
    },
    {
      id: "Phone",
      dataType: "string",
      validations: [
        {
          type: "test",
          params: ['phone number length','Phone no. maxlength should be 12',val => `${val}`.length <= 12
          ]
        },
        {
          type: "matches",
          params: [/^[0-9]*$/, "Enter valid Mobile No."]
        },
      ]
    },
    {
      id: "PinCode",
      dataType: "string",
      validations: [
        {
          type: "max",
          params: [6, "Pin code max length should be 6"]
        },
      ]
    },
]
