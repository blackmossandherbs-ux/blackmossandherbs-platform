{
    "apps": [{
        "name": "blackmossandherbs",
        "script": "npm",
        "args": "start",
        "instances": "max",
        "exec_mode": "cluster",
        "env": {
            "NODE_ENV": "production",
            "PORT": 3005
        },
        "error_file": "./logs/err.log",
        "out_file": "./logs/out.log",
        "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
        "merge_logs": true,
        "autorestart": true,
        "max_memory_restart": "1G",
        "watch": false
    }]
}
