const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      scope: 'repo,user',
      redirect_uri: `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/api/auth`,
    });
    return res.redirect(`https://github.com/login/oauth/authorize?${params}`);
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      }),
    });

    const { access_token, error } = await tokenRes.json();

    if (error || !access_token) {
      return res.status(400).send(`<script>
        window.opener.postMessage('authorization:github:error:${error || 'unknown'}', '*');
        window.close();
      </script>`);
    }

    res.send(`<!DOCTYPE html><html><body><script>
      (function() {
        function receiveMessage(e) {
          window.opener.postMessage(
            'authorization:github:success:{"token":"${access_token}","provider":"github"}',
            e.origin
          );
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })()
    </script></body></html>`);
  } catch (err) {
    res.status(500).send('Auth error');
  }
}
