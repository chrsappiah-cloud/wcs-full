<script setup>
import { founderProfile } from "../config/marketingPortal.js";
import { ADMIN_EMAIL, SUPPORT_EMAIL } from "../config/contactEmails.js";
</script>

<template>
  <div class="contact-emails">
    <a :href="`mailto:${SUPPORT_EMAIL}`" class="accent-link small" title="Support & general enquiries">
      {{ SUPPORT_EMAIL }}
    </a>
    <span class="small muted"> · support</span>
    <br />
    <a :href="`mailto:${ADMIN_EMAIL}`" class="accent-link small" title="Administration">
      {{ ADMIN_EMAIL }}
    </a>
    <span class="small muted"> · admin</span>
    <br />
    <a :href="`mailto:${founderProfile.personalEmail}`" class="accent-link small">{{ founderProfile.personalEmail }}</a>
    <span class="small muted"> · personal</span>
    <br />
    <RouterLink to="/contact" class="accent-link small" style="display:inline-block;margin-top:6px">Send a message</RouterLink>
  </div>
</template>
