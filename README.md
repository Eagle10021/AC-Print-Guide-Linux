# AC-Print Linux Setup Guide for Algonquin College (CUPS)

A reliable, tested configuration guide for setting up the Algonquin College "Find-Me" print queue (`AC-PRINT`) on any Linux distribution that uses CUPS (Common Unix Printing System).

This guide resolves common issues related to SMB authentication loops and incorrect IPP server paths.

---

## Why This Guide Exists

Algonquin College's print system uses **PaperCut Mobility Print**, which is often difficult to configure on Linux due to the lack of an official client. Standard methods like LPD or SMB often fail due to domain authentication issues or incorrect server URIs.

This guide uses the **exact, working IPP (http) connection string** verified from a working Windows configuration, ensuring a stable connection and successful job submission.

## Prerequisites

* A Linux Distribution (e.g., Arch, Ubuntu, Fedora)
* CUPS (Common Unix Printing System) installed and running.
* Your Algonquin College network credentials.
