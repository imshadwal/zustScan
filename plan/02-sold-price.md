# 02 — Sold price

When the admin creates a customer, they also enter the price that customer paid, in whole rupees. The dashboard shows two figures: how many customers exist, and the rupees made till now. The rupees figure is the sum of those prices.

Each customer row still shows its QR, download, and password reset, plus the price it was sold for. The price is not shown on the public guest page.

With no customers, both figures show 0: customer count `0`, and rupees made `₹0`.

The admin session is an httpOnly cookie. It expires 15 minutes after sign-in. The earlier admin plan said 7 days; this replaces that lifetime.

The admin pages use the navy background, with the two figures in cards on top of it.
