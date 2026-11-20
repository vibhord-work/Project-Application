# GitHub Webhook Integration Test

Purpose: Validate automatic Jenkins pipeline triggering through the AWS Application Load Balancer.

Webhook flow:
GitHub Push -> AWS ALB (HTTPS) -> Jenkins -> CI/CD Pipeline

Validation:
- GitHub webhook connectivity verified.
- ALB listener rule configured for /github-webhook/.
- Automatic Jenkins pipeline triggering pending verification.

## Second Webhook Test
Verify Jenkins automatically triggers after merging a PR into main.
