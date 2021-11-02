# Personal CDN 

>  This is documentation of how I created my own CDN 

## Used Technologies 

- lsyncd
- GeoDNS
- Linux

## How my CDN is configured

<center><img src="https://cdn.jserv.xyz/uploads/1635825401159__IMG_0664.jpg"></center>

**Path: LA Node(Vultr) <- Korea (Origin) -> Mumbai Node (Linode) -> Nuremberg Node (Contabo)**, Total 4 PoPs synced with lsyncd.

### GeoDNS Settings

**My PoP List**

- Korea : 1.230.xxx.xx
- Los Angeles : 144.202.xxx.xxx
- Mumbai : 172.105.xx.xxx
- Nuremberg : 167.86.xx.xx

**Regional Settings**

- Africa + Europe -> Nuremberg Node 
- North America + South America -> Los Angeles Node 
- Central Asia + Middle East + South Asia -> Mumbai Node 
- Oceania + East Asia -> Korea Node (Origin)
- Default (Fallback) -> Nuremberg 
  *Reasoning : Contabo Supports Unlimited Bandwidth*

## Lsyncd Configuration

> Important: SSH Between servers should NOT require password. 
>
> *Check this website for how-to* -> [Explanation on Ubuntu (Korean)](https://zetawiki.com/wiki/%EB%A6%AC%EB%88%85%EC%8A%A4_SSH_%ED%8C%A8%EC%8A%A4%EC%9B%8C%EB%93%9C_%EC%97%86%EC%9D%B4_%EC%9E%90%EB%8F%99_%EB%A1%9C%EA%B7%B8%EC%9D%B8)

### Lsyncd Lua Configuration File 

```lua
settings {
    logfile = "/var/log/lsyncd.log",
    statusFile = "/var/log/lsyncd-status.log",
    statusInterval = 20
}

targets = {
    'root@ipaddr:target(absolutepath)',
    'root@ipaddr:target(absolutepath)'
}

for _, target in ipairs( targets )
do
    sync { default.rsync, source="source(absolutepath)", target=target, delay=1, rsync={compress=true, acls=true, verbose=true, rsh="/usr/bin/ssh -p 22 -o StrictHostKeyChecking=no -i /root/.ssh/id_rsa"}}
end

```

### Extra Information

- I used same file construction to make synchronization easier. 
- I changed DNS Settings to get https certs every single time I add PoP, there might be better way. 
- lsyncd takes a good 3-4 seconds to propagate. 

