<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentNotification extends Model
{
    protected $fillable = [
        'user_id',
        'intervention_id',
        'sender_id',
        'type',
        'title',
        'message',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    /**
     * Get the student (user) who receives the notification.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the teacher (sender) who sent the notification.
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the related intervention if any.
     */
    public function intervention()
    {
        return $this->belongsTo(Intervention::class);
    }

    /**
     * Mark the notification as read.
     */
    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Scope to get unread notifications.
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope to get notifications by type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get notification type labels.
     */
    public static function getTypes()
    {
        return [
            'nudge' => 'Reminder Nudge',
            'feedback' => 'Teacher Feedback',
            'task' => 'New Task Assigned',
            'alert' => 'Important Alert',
            'extension' => 'Deadline Extension',
        ];
    }
}
