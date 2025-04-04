export const permissions = [
    {
        role: "user",
        actions: [
            "read",
            "update_profile",
            "update_password",
            "delete_profile",
        ],
    },
    {
        role: "admin",
        actions: [
            "create",
            "read",
            "update",
            "delete"
        ],
    }
]